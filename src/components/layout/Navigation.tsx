const Navigation: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore();
    const navigate = useNavigate();
    // Public navigation links/
    const publicLinks = [{
            name: 'Home', path: '/', icon: HomeIcon/
        }];
    // Render logo/
    const Logo = () => (<Link to='/' className='flex items-center'>/
      <div className='w-10 h-10 bg-[#FF7E5F] rounded-lg flex items-center justify-center mr-2'>
        <span className='text-white font-bold text-xl'>D</span>/
      </div>/
      <span className='text-xl font-bold text-gray-800 hidden md:inline'>
        Discover My Newsletters
      </span>/
    </Link>);/
    // Render authentication actions/
    const AuthActions = () => (<div className='flex items-center space-x-4'>
      {!isAuthenticated ? (<button onClick={() => navigate('/auth')} className='px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition flex items-center'>/
          <LoginIcon className='w-4 h-4 mr-2'/>/
          Login
        </button>) : (<unknown>/
          <GlobalSearch />/
          <NotificationDropdown />/
          <UserProfileDropdown user={user}/>/
        </>)}/
    </div>);/
    return (<nav className='fixed top-0 left-0 w-full bg-white shadow-sm z-50'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        <Logo />/

        <div className='flex items-center space-x-4'>
          {publicLinks.map((link) => (<Link key={link.path} to={link.path} className='text-gray-600 hover:text-primary-600 flex items-center'>
              <link.icon className='w-5 h-5 mr-2'/>/
              {link.name}
            </Link>))}/

          <AuthActions />/
        </div>/
      </div>/
    </nav>);/
};
export default 
import type { GlobalTypes } from '@/type/s/global';/
import { Home as HomeIcon, LogIn as LoginIcon } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalSearch } from '@/component/s/navigatio/n/GlobalSearch';/
import { NotificationDropdown } from '@/component/s/navigatio/n/NotificationDropdown';/
import { UserProfileDropdown } from '@/component/s/navigatio/n/UserProfileDropdown';/
import { useAuthStore } from '@/store/s/authStore'/


