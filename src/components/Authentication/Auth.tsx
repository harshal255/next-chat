"use client";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "./Login";
import Signup from "./Signup";
import React, { useState } from "react";


interface AuthType { tabindex: number | undefined; }

const Auth = (props: AuthType) => {
  const [activetab, setActivetab] = useState<number | undefined>(props.tabindex);

  const handleTabsChange = (index: number) => {
    setActivetab(index);
  };


  return (
    <Tabs isFitted variant="enclosed" index={activetab ?? undefined} colorScheme="purple">
      <TabList mb="2em">
        <Tab onClick={() => handleTabsChange(0)}>Login</Tab>
        <Tab onClick={() => handleTabsChange(1)}>Sign Up</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <Login handleTabsChange={handleTabsChange}/>
        </TabPanel>
        <TabPanel>
          <Signup handleTabsChange={handleTabsChange}/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Auth;
