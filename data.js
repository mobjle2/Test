const data = rawData.map(item => {

  // Nếu là dạng ["CODE","VIP"]
  if (Array.isArray(item)) {
    return {
      code: item[0].replace(/\s+/g,'').replace(/\.$/,'').toUpperCase(),
      vip: item[1]
    };
  }

  // Nếu là dạng {code:"...", mmc:"..."}
  return {
    code: item.code.replace(/\s+/g,'').replace(/\.$/,'').toUpperCase(),
    mmc: item.mmc,
    vip: item.vip
  };

});
