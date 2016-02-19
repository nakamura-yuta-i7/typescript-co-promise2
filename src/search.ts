declare function require(x: string): any;
var $ = require("jquery")

export class Search {
	static wikipedia(term) {
		return $.ajax({
			url: 'https://jp.wikipedia.org/w/api.php',
			dataType: 'jsonp',
			data: {
				action: 'opensearch',
				format: 'json',
				search: term
			}
		}).promise();
	}
}
