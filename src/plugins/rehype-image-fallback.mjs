import { visit } from 'unist-util-visit';
import { imageFallbackConfig } from '../config.ts';

export default function rehypeImageFallback() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && node.properties && node.properties.src) {
        const src = node.properties.src;
        
        // 检查是否启用回退功能并且是来自指定域名的图片
        if (imageFallbackConfig.enable && typeof src === 'string' && src.includes(imageFallbackConfig.originalDomain)) {
          // 生成备用 URL
          const fallbackSrc = src.replace(imageFallbackConfig.originalDomain, imageFallbackConfig.fallbackDomain);
          
          // 添加 onerror 属性
          node.properties.onerror = `this.onerror=null; this.src='${fallbackSrc}';`;
        }
      }
    });
  };
}