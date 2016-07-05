(function(eloqua){
	
	eloqua.verify = function (uri, mehod, client_id, client_secret){
		var request = verification.request(uri, mehod);
		var signature = request.query.oauth_signature;
		delete request.query.oauth_signature;
		var generated = verification.signature(request.query, request, client_id, client_secret);
		
		return client_id === request.query.oauth_consumer_key && generated === signature;
	};
	
})(module.exports);