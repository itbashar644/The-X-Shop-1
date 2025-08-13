import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import ContactMethodField from "@/components/account/ContactMethodField";
import TelegramNicknameField from "@/components/account/TelegramNicknameField";
import AddressList from "@/components/account/AddressList";

// Схема Zod
const profileSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().optional(),
  address: z.string().optional(),
  preferredContactMethod: z.enum(["phone", "telegram", "whatsapp"]),
  telegramNickname: z.string().optional(),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onCancel, onSuccess }) => {
  const { user, updateProfile } = useAuth();

  const [favoriteAddresses, setFavoriteAddresses] = useState<string[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      preferredContactMethod: user?.preferredContactMethod ?? "phone",
      telegramNickname: user?.telegramNickname ?? "",
      avatar: user?.avatar ?? "",
    },
  });

  const watchContactMethod = form.watch("preferredContactMethod");

  useEffect(() => {
    if (user?.savedAddresses && Array.isArray(user.savedAddresses)) {
      setFavoriteAddresses(user.savedAddresses);
    }
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      let avatarUrl = avatarPreview;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const updatedProfile = {
        ...data,
        savedAddresses: favoriteAddresses,
        avatar: avatarUrl,
      };

      await updateProfile(updatedProfile);
      toast.success("Профиль успешно обновлён");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при обновлении профиля");
    }
  };

  const handleAddAddress = (address: string) => {
    if (!favoriteAddresses.includes(address)) {
      setFavoriteAddresses((prev) => [...prev, address]);
    }
  };

  const handleRemoveAddress = (address: string) => {
    setFavoriteAddresses((prev) => prev.filter((item) => item !== address));
    toast.success("Адрес удалён из избранных");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Личные данные</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              <Avatar className="h-24 w-24">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Аватар" />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {user?.name?.charAt(0).toUpperCase() || "П"}
                  </AvatarFallback>
                )}
              </Avatar>
              <label className="cursor-pointer">
                <span className="text-sm font-medium text-primary underline">
                  {avatarPreview ? "Изменить фото" : "Добавить фото"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите ваше имя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите ваш телефон" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Правильные пропсы для компонентов: form={form} */}
            <ContactMethodField form={form} />

            <TelegramNicknameField form={form} />

            <AddressList
              addresses={favoriteAddresses}
              onAddAddress={handleAddAddress}
              onRemoveAddress={handleRemoveAddress}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                Отмена
              </Button>
              <Button type="submit" className="ml-4">
                Сохранить изменения
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Заглушка загрузки аватара (замени при необходимости на реальную отправку)
async function uploadAvatar(file: File): Promise<string> {
  return URL.createObjectURL(file);
}

export default ProfileForm;
