import React from 'react';
import Lottie from 'react-lottie';
import { useWindowSize } from '../hooks/useWindowSize';
import animationData from './lottie/4958-404-not-found.json';
import { Link } from 'office-ui-fabric-react';
import RouterLink from './RouterLink';

export function NotFound404() {
  const { width, height } = useWindowSize();
  return (
    <div
      style={{
        padding: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height,
        width,
        flexDirection: 'column'
      }}
    >
      <p>Sorry we couldn't find what you were looking for...</p>
      <p>
        <RouterLink to="/">
          <Link>Back to home</Link>
        </RouterLink>
      </p>
      {animationData && (
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          }}
          height={200}
          width={200}
        />
      )}
    </div>
  );
}
