// import React, {useEffect} from 'react';
// import {useAuthStore} from '../store/authStore';
import {SideBar} from '../components/SideBar';

export const Home = ({ tab }) => {
  // const {user} = useAuthStore();

  // useEffect(() => {
  //   if (user) console.log(user);
  // }, [user]);

  return (
    <div className="w-full flex justify-center items-center flex-col gap-10">
      <SideBar initialTab={tab} />
    </div>
  );
}
