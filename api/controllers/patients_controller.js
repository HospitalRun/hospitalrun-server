exports.root = (request, response) => {
  return response.status(501).send('root unimplemented');
};

exports.notroot = (request, response) => {
  return response.status(501).send('not root unimplemented');
};
