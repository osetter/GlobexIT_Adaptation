import { useEffect, useState } from "react";
import { IUser } from "../types.ts";
import { fetchUsers } from "../api.ts";
import { Divider, List, Spin, Empty } from "antd";

export default function Users() {
    const [userList, setUserList] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data: IUser[] = await fetchUsers();
                setUserList(data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    return (
        <div>
            <Divider orientation="center">Список пользователей</Divider>
            {loading ? (
                <div style={{ textAlign: "center" }}>
                    <Spin size="large" />
                </div>
            ) : userList.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={userList}
                    bordered
                    renderItem={(user) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<span>{user.name}</span>}
                                description={`${user.email} • ${user.username}`}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="Нет данных для отображения" />
            )}
        </div>
    );
}
