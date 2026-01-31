import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY))
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = await admin.auth().verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decoded.uid).get();

    if (!userDoc.exists || !userDoc.data().active) {
      return res.status(403).json({ error: "No permission" });
    }

    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Missing code" });

    const norm = code.toUpperCase().replace(/[^A-Z0-9]/g,"");

    const snap = await db.collection("chips")
      .where("norm","==",norm)
      .get();

    if (snap.empty) return res.json({ found:false });

    const result = snap.docs.map(d=>d.data());

    await db.collection("logs").add({
      uid: decoded.uid,
      code,
      time: new Date()
    });

    res.json({ found:true, data:result });

  } catch(err){
    res.status(401).json({ error:"Unauthorized" });
  }
}
