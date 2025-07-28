/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // 使用 Chrome 作为默认浏览器
  defaultProduct: 'chrome',
  
  // 指定浏览器下载目录
  cacheDirectory: '.cache/puppeteer',
  
  // 自动下载浏览器
  downloadHost: process.env.PUPPETEER_DOWNLOAD_HOST || 'https://storage.googleapis.com',
};