import backgroundImage from '@/images/background-auth.jpg';

const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen justify-center md:px-12 lg:px-0">
      {/* Contenu principal */}
      <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-28">
        <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
          {children}
        </div>
      </div>

      {/* Image de fond */}
      <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundImage}
          alt=""
          unoptimized="true"
        />
      </div>
    </div>
  );
};

export default AuthLayout;