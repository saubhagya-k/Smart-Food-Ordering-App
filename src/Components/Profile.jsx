import  User_Details from "./User_Details";


const Profile = ({ user, setUser, setShowLogin }) => {

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className=" bg-[#ff5200] h-50 rounded-b-3xl relative">
        <div className="text-3xl text-white text-black mt-30 ml-5 absolute ">
          <h1>{user.username}</h1>
          <h2>{user.email}</h2>
        </div>

      </div>
      <User_Details/>
    </div>
  );
};

export default Profile;
