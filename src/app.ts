declare function require(x: string): any;
var co = require("co")
var $ = require("jquery")
var Rx = require('rx')

require("./app.scss")

var arr = [1, 2, 3, 4, 5, 6, 7, 8]

Rx.Observable.from(arr) // 配列をストリーム(Observable)に変換
	.forEach(function(num) {  // `forEach`は`subscribe`のエイリアスです。戻り値：Diposable
		return console.log(num);
	});

window["addArr"] = function() {
	arr.push(1)
	console.log( "arr", arr );
}




// var clickStream = Rx.Observable.fromEvent(document, "mouseup");
// clickStream
//     .buffer(clickStream.throttle(250))
//     .map(function(x) {return x.length})
//     .filter(function(n) {return n >= 2})
//     .subscribe(function(n) {console.log(n + "click")});

const $input = $('#input');
const $results = $('#results');

/* Only get the value from each key up */
var keyups = Rx.Observable.fromEvent($input, 'keyup')
	.pluck('target', 'value')
	.filter(function(text) {
 console.log(text);
 return text.length >= 2
});

/* Now debounce the input for 500ms */
var debounced = keyups
	.debounce(500 /* ms */);

console.log("debounced", debounced);

/* Now get only distinct values, so we eliminate the arrows and other control characters */
var distinct = debounced
	.distinctUntilChanged();

console.log("distinct", distinct);

var suggestions = distinct
	.flatMapLatest(searchWikipedia);

console.log("suggestions", suggestions);

suggestions.subscribe(
	data => {
		console.dirxml({ data });
		$results
			.empty()
			.append($.map(data[1], value => $('<li>').text(value)))
	},
	error=> {
		$results
			.empty()
			.append($('<li>'))
   .text('Error:' + error);
	});

function searchWikipedia(term) {
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





import {Search} from "./search";

$("[name=q]").on("change", (e) => {
	var q = $(e.target).val()

	co(function *() {

		var result = yield Search.wikipedia(q)
		if (result[1].length == 0) {
			throw new Error(`${q}はWikipediaからは見つかりませんでした`)
		}

		var titles, descs, urls;

		titles = result[1]
		descs = result[2]
		urls = result[3]

		Object.keys(titles).forEach((i) => {
			var $div = $(`
				<div class="result-object">
					<h2>${titles[i]}</h2>
					<p>${descs[i]}</p>
					<p><a target="_blank" href="${urls[i]}">${urls[i]}</a></p>
				</div>
			`)
			$(".wikipedia").append($div)
		})

	}).catch(function(err) {
		$(".wikipedia").append(err)
	})

})
