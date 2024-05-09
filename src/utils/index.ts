export function decimalToHexString(decimalNumber: number) {
  let number = decimalNumber;
  if (number < 0) {
    number = 0xffffffff + number + 1;
  }

  let result = number.toString(16).toUpperCase();
  if (result.length === 1) {
    result = '0' + result;
  }

  return result;
}

export function isAndroid() {
  const agent = window.navigator.userAgent.toLowerCase();
  return agent.indexOf('android') > -1;
}

export function isFirefox() {
  const agent = window.navigator.userAgent.toLowerCase();
  return agent.indexOf('firefox') > -1;
}

export function isSafari() {
  const agent = window.navigator.userAgent.toLowerCase();
  const chromeAgent = agent.indexOf('chrome') > -1;
  const safariAgent = agent.indexOf('safari') > -1;

  // Discard Safari since it also matches Chrome
  if (chromeAgent && safariAgent) {
    return false;
  }

  return safariAgent;
}

export function isWithinViewport(el: HTMLElement | null): boolean {
  if (el === null) {
    return false;
  }

  const elTop = el.getBoundingClientRect().top;
  const elOffsetHeight = el.offsetHeight * 1;
  const negativeOffsetHeight = elOffsetHeight * -1;
  const result = elTop <= elOffsetHeight && elTop >= negativeOffsetHeight;

  return result;
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });
}
