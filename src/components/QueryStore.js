var QueryStore = (function() {
  var query = "";

  var setQuery = function(q) {
    query = q;
    return query;
  };

  var getQuery = function() {
    return query;
  };

  return {
    setQuery: setQuery,
    getQuery: getQuery
  }

})();

export default QueryStore;
