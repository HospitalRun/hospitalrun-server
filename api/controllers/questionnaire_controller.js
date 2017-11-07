exports.index = (request, response) => {
  return response.status(501).json({ message: 'root unimplemented' });
};

exports.create = (request, response) => {
  return response.status(201).json({ message: 'created (not really though...)' });
};
