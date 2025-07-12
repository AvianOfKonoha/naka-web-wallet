import {toast} from 'vue3-toastify';

/**
 * With the power of Clipboard API the method copies the text of the sibling Element.
 * */
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);

  toast('Copied to clipboard', {
    autoClose: 1000,
    type: 'info',
    theme: 'dark',
    position: 'bottom-center',
    transition: 'bounce',
    hideProgressBar: true,
    toastClassName: 'toast__wrap',
    bodyClassName: 'toast__body'
  });
};

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export function isMobileChrome() {
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const isChrome =
    /Chrome/i.test(ua) &&
    !/Edg/i.test(ua) &&
    !/OPR/i.test(ua) &&
    !/Brave/i.test(ua);
  const isMetaMask = ua.includes('MetaMask');

  return isMobile && isChrome && !isMetaMask;
}
