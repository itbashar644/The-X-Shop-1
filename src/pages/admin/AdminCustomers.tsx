import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/types/variables";
import { useNavigate } from "react-router-dom";

// Тип для пользователя
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
  // Добавьте другие поля, если есть
}

const AdminCustomers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Загрузка пользователей из базы данных
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error("Ошибка загрузки пользователей");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Фильтрация по поиску
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.phone && user.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Клиенты</h2>
        <Button disabled>
          <Users className="mr-2 h-4 w-4" />
          Клиенты
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Поиск клиентов</CardTitle>
          <CardDescription>
            Найдите клиентов по имени, email или номеру телефона
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск клиентов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список клиентов</CardTitle>
          <CardDescription>Все зарегистрированные пользователи</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Input
              placeholder="Поиск по email, имени или телефону"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-80"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Дата регистрации</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>Загрузка...</TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>Нет пользователей</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id} onClick={() => navigate(`/admin/customer/chat/${user.id}`, {
                    state: { user } 
                  })}
                   style={{ cursor: "pointer" }}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
