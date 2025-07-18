import {toast} from 'vue3-toastify';

export const bottomToast = (
  message: string,
  autoClose: number,
  className?: string
) => {
  toast(message, {
    autoClose: autoClose,
    type: 'info',
    theme: 'dark',
    position: 'bottom-center',
    transition: 'bounce',
    hideProgressBar: true,
    toastClassName: `toast__wrap ${className || ''}`,
    bodyClassName: 'toast__body'
  });
};

/**
 * With the power of Clipboard API the method copies the text of the sibling Element.
 * */
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  bottomToast('Copied to clipboard', 1000);
};

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export function isMobileChrome() {
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const isChrome =
    (/Chrome/i.test(ua) || /CriOS/i.test(ua)) &&
    !/Edg/i.test(ua) &&
    !/OPR/i.test(ua) &&
    !/Brave/i.test(ua);
  const isMetaMask = ua.includes('MetaMask');

  return isMobile && isChrome && !isMetaMask;
}

export const localizeDateTime = (date?: Date | null, emptyOutput?: string) => {
  if (!date) {
    return emptyOutput || '/';
  }

  return new Date(date).toLocaleDateString('sl-SI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const openNewTab = (url: string) => {
  window.open(url, '_blank');
};

export const formatUint256toNumber = (value: bigint, decimals: number) => {
  return Number(BigInt(value)) / 10 ** decimals;
};

export const formatNumberToUint256 = (value: number, decimals: number) => {
  return BigInt(value) * BigInt(10 ** decimals);
};
