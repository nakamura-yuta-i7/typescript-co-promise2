export class Person {
	getFullName() {
		return new Promise(function(resolve, reject) {
			setTimeout(()=>{
				resolve("中村祐太")
			}, 500)
		})
	}
}
