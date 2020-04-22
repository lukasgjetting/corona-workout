import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const TabBarIcon = ({ name, focused }) => (
  <Ionicons
    name={name}
    size={38}
    style={{ marginBottom: -3 }}
    color={focused ? '#00F' : '#FF0'}
  />
);

export default TabBarIcon;
