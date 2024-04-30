/**
 * 检测当前元素是否在可见范围
 * @param element
 */
export function elementIsVisible(element: HTMLElement | null): Promise<boolean> {
	return new Promise((resolve, reject) => {
		if (element)
			try {
				const observer = new IntersectionObserver((entries, observer) => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							resolve(true); // 元素在可见范围内
						} else {
							resolve(false); // 元素不在可见范围内
						}
						observer.unobserve(element);
						observer.disconnect();
					});
				});
				observer.observe(element);
			}catch (e) {
				reject(e)
			}
		else reject('当前元素不存在')
	});
}