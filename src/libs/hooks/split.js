import { notifications } from "@mantine/notifications";
import { useCallback, useState } from "react";
import api from "../utils/api";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";

export const useSplit = ({ id }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState();
  // eslint-disable-next-line no-unused-vars
  const pathKey = `/v1/splits/${id}`;
  const { data, error, isValidating } = useSWR(pathKey);

  const onAdd = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const { data: res } = await api.post("/v1/splits", { data: data });
        console.log(res);
        if (res.status === 1) {
          navigate(`/splits/${res?.data?.id}`);
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
    [navigate]
  );

  return {
    data: data?.data || {},
    onAdd,
    error,
    loading: loading || isValidating,
  };
};
