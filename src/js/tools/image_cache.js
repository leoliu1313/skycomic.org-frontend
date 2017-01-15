define(['jquery'], function () {
window.imageCache = (function () {
	var cacheContainer = document.createElement('div');
	cacheContainer.style.display = 'none';
	document.body.appendChild(cacheContainer);

	var promise = Promise.resolve(),
		cacheInfo = {},
		imgs = [],
		maxChildren = 50;

	var fetchPromise = function (url) {
		return new Promise(function (resolve, reject) {
			var img = document.createElement('img');
			img.onerror = function () {
				cacheContainer.removeChild(img);
				imgs = imgs.splice(imgs.indexOf(img), 1);

				cacheInfo[url].tryCount --;
				if (cacheInfo[url].tryCount <= 0) {
					resolve();
				} else {
					resolve(fetchPromise(url));
				}
			};
			img.onload = resolve;
			img.src = url;

			cacheContainer.appendChild(img);
			imgs.push(img);
			if (imgs.length > maxChildren) {
				cacheContainer.removeChild(imgs.shift());
			}
		});
	};

	return {
		add: function (url) {
			if (!!cacheInfo[url]) {
				return ;
			}

			cacheInfo[url] = {
				tryCount: 4
			};
			return fetchPromise(url);
		}
	};
})();
});
