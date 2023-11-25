import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";
import api from "../utils/api";
import { notifications } from "@mantine/notifications";

export const useMates = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["bagirata"]);

  const [userID, setUserID] = useState(cookies.userID || "");
  const [acronym, setAcronym] = useState('');

  const pathKey = `/v1/users/${userID}`
  const { data: user } = useSWR(() =>
    userID ? pathKey : ""
  );

  const getAcronym = (name) => {
    const splitted = name?.split(" ")

    let acr = ''

    if (splitted?.length == 1) {
      acr = splitted[0].length > 2 ?
        splitted[0].substring(0, 2).toUpperCase() :
        splitted[0].toUpperCase();
    } else {
      acr = splitted?.map((word) => word[0]).
        join('').
        toUpperCase();
    }

    setAcronym(acr)
  }

  useEffect(() => {
    setUserID(cookies.userID)
    getAcronym(user?.name)
  }, [cookies, user])

  const [loading, setLoading] = useState(false);

  const onRegister = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const { data: res } = await api.post("/v1/users", data);
        if (res.message === "success") {
          setCookie("userID", res?.data, { path: "/" });

          mutate(`/v1/users/${res?.data}`)
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
    [setCookie, mutate]
  );

  const onAddMate = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const { data: res } = await api.post(`/ v1 / users / mates ? owner_id = ${data.owner_id}`, data);
        if (res.message === "success") {
          mutate(pathKey)
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
    [setCookie]
  );

  const onDelete = useCallback(
    async (id) => {
      try {
        setLoading(true);

        const { data: res } = await api.delete(`/ v1 / users / ${id} / mate`);

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
        const { data: res } = await api.post(`/ v1 / banks`, data);
        if (res.message === "success") {
          mutate(`/v1/bills?owner_id=${res?.id}`)
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
    [setCookie]
  );

  const onDeleteBank = useCallback(
    async (id) => {
      try {
        setLoading(true);

        const { data: res } = await api.delete(`/ v1 / banks / ${id}`);

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
    acronym,
    loading
  };
}