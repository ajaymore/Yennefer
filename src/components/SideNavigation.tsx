import React, { useState } from 'react';
import { Nav, Icon } from '@fluentui/react';
import { useWindowSize } from '../hooks/useWindowSize';
import { useHistory } from 'react-router-dom';
import { animated as a, useSpring } from 'react-spring';
import firebase from 'firebase/app';

const AnimatedIcon = a(Icon);

function SideNavigation(props: { children: React.ReactElement }) {
  const { width, height } = useWindowSize();
  const [selectedKey, setSelectedKey] = useState('home');
  const showNavToggle = width < 700;
  const [toggle, setToggle] = useState(!showNavToggle);
  const history = useHistory();
  const navAnimation = useSpring({
    x: toggle ? 0 : -280
  });
  const contentWidth = showNavToggle ? width : width - 208;

  return (
    <div style={{ width, position: 'relative' }}>
      <a.div
        style={{
          position: 'absolute',
          width: 208,
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1,
          transform: navAnimation.x.interpolate(xVal => `translateX(${xVal}px)`)
        }}
      >
        <div
          style={{ position: 'relative', width: 208, backgroundColor: '#fff' }}
        >
          <Nav
            onLinkClick={() => {}}
            selectedKey={selectedKey}
            ariaLabel="Nav basic example"
            styles={{
              root: {
                width: 208,
                height,
                boxSizing: 'border-box',
                border: '1px solid #eee',
                overflowY: 'auto'
              }
            }}
            groups={[
              {
                links: [
                  {
                    name: 'Admin',
                    url: '',
                    expandAriaLabel: 'Expand Home section',
                    collapseAriaLabel: 'Collapse Home section',
                    links: [
                      {
                        name: 'Users',
                        onClick: () => {
                          history.push('/admin/users');
                          setSelectedKey('/admin/users');
                          if (showNavToggle) {
                            setToggle(false);
                          }
                        },
                        key: '/admin/users',
                        url: ''
                      },
                      {
                        name: 'Groups',
                        url: '',
                        key: '/admin/groups',
                        onClick: () => {
                          history.push('/admin/groups');
                          setSelectedKey('/admin/groups');
                          if (showNavToggle) {
                            setToggle(false);
                          }
                        }
                      }
                    ],
                    isExpanded: true
                  },
                  {
                    name: 'Documents',
                    url: 'https://example.com',
                    key: 'key3',
                    isExpanded: true,
                    target: '_blank'
                  },
                  {
                    name: 'Pages',
                    url: 'https://msn.com',
                    key: 'key4',
                    target: '_blank'
                  },
                  {
                    name: 'Notebook',
                    url: 'https://msn.com',
                    key: 'key5',
                    disabled: true
                  },
                  {
                    name: 'Communication and Media',
                    url: 'https://msn.com',
                    key: 'key6',
                    target: '_blank'
                  },
                  {
                    name: 'News',
                    url: 'https://cnn.com',
                    icon: 'News',
                    key: 'key7',
                    target: '_blank'
                  },
                  {
                    name: 'Sign Out',
                    url: '',
                    key: '/signout',
                    onClick: () => firebase.auth().signOut()
                  }
                ]
              }
            ]}
          />
          {showNavToggle && (
            <AnimatedIcon
              iconName="Cancel"
              style={{
                transform: navAnimation.x
                  .interpolate({
                    range: [-280, -20, 0],
                    output: [0, 0.4, 1]
                  })
                  .interpolate(s => {
                    return `scale(${s})`;
                  }),
                position: 'absolute',
                right: -35,
                top: 0,
                fontSize: 28,
                borderRight: '1px solid rgba(0,0,0,.132)',
                borderBottom: '1px solid rgba(0,0,0,.132)',
                backgroundColor: '#fff',
                padding: 4,
                cursor: 'pointer'
              }}
              onClick={() => setToggle(prev => !prev)}
            >
              Toggle
            </AnimatedIcon>
          )}
        </div>
      </a.div>
      <div
        style={{
          width: contentWidth,
          transform: `translateX(${showNavToggle ? 0 : 208}px)`
        }}
      >
        {props.children}
        {showNavToggle && (
          <div
            className="ms-depth-64"
            style={{
              zIndex: 5,
              transform: navAnimation.x
                .interpolate({
                  range: [-280, -20, 0],
                  output: [1, 0.1, 0]
                })
                .interpolate(s => {
                  return `scale(${s})`;
                }),
              position: 'absolute',
              left: 8,
              top: 8,
              height: 36,
              width: 36,
              borderRadius: 28,
              padding: 8,
              cursor: 'pointer',
              backgroundColor: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <AnimatedIcon
              iconName="GlobalNavButton"
              style={{
                fontSize: 28,
                cursor: 'pointer'
              }}
              onClick={() => setToggle(prev => !prev)}
            >
              Toggle
            </AnimatedIcon>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideNavigation;
