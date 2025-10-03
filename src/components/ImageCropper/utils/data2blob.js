/**
 * Convert database64 file format to binary
 *
 * @param  {[String]} data The format of the dataURL is "data:image/png;base64,****". Before the comma, there are some descriptive texts, we only need the one after the comma.
 * @param  {[String]} mime [description]
 * @return {[blob]}      [description]
 */
export default function(data, mime) {
  data = data.split(',')[1]
  data = window.atob(data)
  var ia = new Uint8Array(data.length)
  for (var i = 0; i < data.length; i++) {
    ia[i] = data.charCodeAt(i)
  }
  // The default format returned by canvas.toDataURL is image/png
  return new Blob([ia], {
    type: mime
  })
}
