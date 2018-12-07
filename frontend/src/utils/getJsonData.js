export default function getJsonData(route) {
  const result = fetch(route)
    .then(response => response.json())
    .then(jsonResponse => {
      return jsonResponse;
    })
    .catch(error => {
      return [];
    });

  return result;
}
