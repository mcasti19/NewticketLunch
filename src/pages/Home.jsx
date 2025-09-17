import {SideBar} from '../components/SideBar';

export const Home = ({ tab }) => {

  return (
    <div className="w-full flex justify-center items-center flex-col gap-10">
      <SideBar initialTab={tab} />
    </div>
  );
}
