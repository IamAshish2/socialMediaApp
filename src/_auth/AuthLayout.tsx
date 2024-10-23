import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to = "" />
      ) : (
        <>
          <section className='flex flex-col flex-1 justify-center items-center'>
            <Outlet />
          </section>
          <img src="/assets/images/side-img.svg" alt="logo" 
          className='hidden md:flex w-1/2 xl:block object-cover bg-no-repeat'/>
        </>
      )}
    </>
  )
}

export default AuthLayout
