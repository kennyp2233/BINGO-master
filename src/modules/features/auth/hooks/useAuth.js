import { useEffect, useState } from 'react';
import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
  const [isLoggin, setIsLoggin] = useState(false);
  const [name, setName] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setIsLoggin(true);
        setName(user.displayName);
      } else {
        setIsLoggin(false);
      }
    });
  }, []);

  return { isLoggin, name };
};
