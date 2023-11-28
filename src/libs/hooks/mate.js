import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";
import api from "../utils/api";
import { notifications } from "@mantine/notifications";

export const useMates = () => {
  //eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["bagirata"]);

  const [userID, setUserID] = useState(cookies.userID || "");

  const pathKey = `/v1/users/${userID}`;
  const { data: user } = useSWR(() => (userID ? pathKey : ""));

  useEffect(() => {
    setUserID(cookies.userID);
  }, [cookies]);

  const [loading, setLoading] = useState(false);

  const onRegister = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const { data: res } = await api.post("/v1/users", data);
        if (res.message === "success") {
          setCookie("userID", res?.data, { path: "/" });
          setUserID(res?.data);
          mutate(`/v1/users/${res?.data}`);
          notifications.show({
            title: "Success",
            message: "You are authenticated!",
            color: "blue",
          });
        } else {
          notifications.show({
            title: "Error",
            message: "Something went wrong!",
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: error,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    [setCookie]
  );

  const onAddMate = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const { data: res } = await api.post(
          `/v1/users/mates?owner_id=${data.owner_id}`,
          data
        );
        if (res.message === "success") {
          mutate(pathKey);
          notifications.show({
            title: "Success",
            message: "Mate has added!",
            color: "blue",
          });
        } else {
          notifications.show({
            title: "Error",
            message: "Something went wrong!",
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: error,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    [pathKey]
  );

  const onDelete = useCallback(
    async (id) => {
      try {
        setLoading(true);

        const { data: res } = await api.delete(`/v1/users/${id}/mate`);

        if (res.message === "success") {
          mutate(pathKey);
          notifications.show({
            title: "Success",
            message: "Mate has deleted",
            color: "blue",
          });
        } else {
          notifications.show({
            title: "Error",
            message: res.message,
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Something went wrong",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    [pathKey]
  );

  const onAddBank = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const { data: res } = await api.post(`/v1/banks`, data);
        if (res.message === "success") {
          mutate(pathKey);
          notifications.show({
            title: "Success",
            message: "Bank has added!",
            color: "blue",
          });
        } else {
          notifications.show({
            title: "Error",
            message: "Something went wrong!",
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: error,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    [pathKey]
  );

  const onDeleteBank = useCallback(
    async (id) => {
      try {
        setLoading(true);

        const { data: res } = await api.delete(`/v1/banks/${id}`);

        if (res.message === "success") {
          mutate(pathKey);
          notifications.show({
            title: "Success",
            message: "Bank has deleted",
            color: "blue",
          });
        } else {
          notifications.show({
            title: "Error",
            message: res.message,
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Something went wrong",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    [pathKey]
  );

  return {
    data: user,
    onRegister,
    onAddMate,
    onAddBank,
    onDelete,
    onDeleteBank,
    loading,
  };
};
