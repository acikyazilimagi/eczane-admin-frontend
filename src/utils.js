export const getDateQuery = () => "?" + Date.now();

export const verifyLatLong = (refLat, refLong, lat, long, km) => {
  let ky = 40000 / 360;
  let kx = Math.cos((Math.PI * refLat) / 180.0) * ky;
  let dx = Math.abs(refLong - long) * kx;
  let dy = Math.abs(refLat - lat) * ky;
  let result = Math.sqrt(dx * dx + dy * dy) <= km;

  if (result) {
    return true;
  } else {
    alert("Lütfen belirtilen şehir sınırları içerisinde bir lokasyon giriniz.");

    return false;
  }
};
