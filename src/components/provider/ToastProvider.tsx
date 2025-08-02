'use client';

import { toast, ToastContainer, cssTransition } from 'react-toastify';
import Toast from '../common/atom/Toast';

const CustomTransition = cssTransition({
  enter: 'animate-slideUp',
  exit: 'animate-fadeOut',
});

export function ToastProvider() {
  return (
    <ToastContainer
      hideProgressBar
      closeOnClick
      closeButton={false}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      transition={CustomTransition}
      position="bottom-center"
      theme="dark"
      toastClassName={() =>
        'pointer-events-auto min-w-[300px] w-[90%] flex items-center px-5 py-3 bg-opacity-lightBlack90 rounded-lg'
      }
    />
  );
}

export function showToast(message: string, cancelBtnText: string = '', onCancel: () => void = () => {}) {
  const toastId = toast(
    <Toast
      message={message}
      cancelBtnText={cancelBtnText}
      onClose={() => {
        onCancel();
        toast.dismiss(toastId); // 버튼 클릭 시 토스트 닫기
      }}
    />,
    {
      autoClose: message.length > 20 ? 3000 : 2000, // 계산된 autoClose 적용
    },
  );
}
