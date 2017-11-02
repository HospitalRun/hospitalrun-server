exports.root = (request, response) => {
  return response.status(501).send('patients / unimplemented');
};

exports.notroot = (request, response) => {
  return response.status(501).send('patients /root unimplemented');
};
