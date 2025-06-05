'use client';

import { postLogout } from '@/api/apis';
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { showToast } from '../provider/ToastProvider';
import Text from '../common/atom/Text';
import { usePostFilterStore } from '@/store/postFilterStore';
import { useRouter } from 'next/navigation';
import LogoutModal from '../modal/LogoutModal';
import { AxiosError } from 'axios';

export default function LogoutBtn() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isLogin = useAuthStore((state) => state.isLogin);
  const { setIsLogin, authStoreClear } = useAuthStore();
  const { postStoreClear } = usePostFilterStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const LogoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      setIsLogin(false);
      localStorage.removeItem('nickname');
      authStoreClear();
      postStoreClear();
      queryClient.removeQueries({ queryKey: ['post'] });
      router.push('/');
      showToast('로그아웃되었습니다.');
    },
    onError: (error: AxiosError) => {
      if (error.status !== 401) {
        showToast('로그아웃 실패. 다시 시도해주세요.');
        console.error(error);
      }
    },
  });

  const handleLogoutClick = () => {
    LogoutMutation.mutate();
  };

  if (!isLogin) return null;

  return (
    <>
      <div onClick={() => setShowLogoutModal(true)} className="h-[57px] flex items-center">
        <Text color="darkGray" className="cursor-pointer underline">
          로그아웃
        </Text>
      </div>
      {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onContinue={handleLogoutClick} />}
    </>
  );
}
