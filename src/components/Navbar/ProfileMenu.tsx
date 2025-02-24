import { MouseEvent } from "react";
import {
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ProfileModal } from "../miscellaneous/ProfileModal";
import { useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface ProfileMenuType {
  isOpen: boolean;
  onOpen: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onClose: () => void;
}

const ProfileMenu = (props: ProfileMenuType) => {
  const { toggleColorMode } = useColorMode();
  const { data: session } = useSession();
  const user = session?.user;

  // const context = useContext(chatContext);
  // const {
  //   user,
  //   setUser,
  //   setIsAuthenticated,
  //   setActiveChatId,
  //   setMessageList,
  //   setReceiver,
  // } = context;
  const router = useRouter();
  const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut({ redirect: false });
      console.log("logout");
      router.push("/");
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }

  // const handleLogout = async (e) => {
  //   e.preventDefault();
  //   setUser({});
  //   setMessageList([]);
  //   setActiveChatId("");
  //   setReceiver({});
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("token");
  //   setIsAuthenticated(false);
  // };
  return (
    <>
      <Menu>
        {
          <>
            <MenuButton
              isActive={props.isOpen}
              as={Button}
              rightIcon={<ChevronDownIcon />}
              leftIcon={
                <Image
                  boxSize="26px"
                  borderRadius="full"
                  src={user?.profilePic}
                  alt="profile-pic"
                />
              }
            >
              <Text
                display={{
                  base: "none",
                  md: "block",
                }}
                fontSize={"13px"}
              >
                {user?.name}
              </Text>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={props.onOpen}>MyProfile</MenuItem>
              <MenuItem
                display={{
                  base: "block",
                  md: "none",
                }}
                onClick={toggleColorMode}
              >
                {localStorage.getItem("chakra-ui-color-mode") === "light"
                  ? "Dark Mode"
                  : "Light Mode"}
              </MenuItem>
              <MenuItem color={"red"}
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </>
        }
      </Menu>
      <ProfileModal
        isOpen={props.isOpen}
        onClose={props.onClose}
      />
    </>
  );
};

export default ProfileMenu;
