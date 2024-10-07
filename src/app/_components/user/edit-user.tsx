import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { userSchema, UserSchema } from '@/schema/user';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertTriangle, EditIcon, Loader } from 'lucide-react';
import { ContentLayout } from '@/components/content-layout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { User } from './columns';
interface EditUserProps {
  data: User;
}

export const EditUser = ({ data }: EditUserProps) => {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      branch: data.branch ?? undefined,
      email: data.email,
      employee_id: data.employee_id,
      full_name: data.full_name,
      gender: data.gender,
      mobile: data.mobile,
      password: data.password,
      role: data.role,
    },
  });
  const [logo, setLogo] = useState<File[] | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const update = useMutation({
    mutationKey: ['update-user'],
    mutationFn: async (d: UserSchema) => {
      return await api
        .patch(`/user/${data._id}`, d)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data;
        })
        .catch((err) => {
          throw err;
        });
    },
    onError: (error) => {
      toast.error(error.message, {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success('User Updated', {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      setOpen(false);
      const params = new URLSearchParams(searchParams.toString());
      router.push(`${pathname}?${params.toString()}`);
      router.refresh();
    },
  });

  const onSubmit = form.handleSubmit(async (data: UserSchema) => {
    await update.mutateAsync(data);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex">
          <div className="mt-1">
            <EditIcon className="h-3 w-3" />
          </div>
          <div className="px-2">Edit</div>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[90%] overflow-y-auto sm:min-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid h-full grid-cols-1 md:grid-cols-4">
              <div className="col-span-4 px-2 py-4 md:px-7">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employee_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Branch <span className="text-xs">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          {/* @ts-ignore  */}

                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mt-2 flex flex-col space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {['Male', 'Female'].map((i) => (
                                <SelectItem key={i} value={i}>
                                  {i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mt-2 flex flex-col space-y-3">
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {['Admin', 'Manager', 'Supervisior'].map((i) => (
                                <SelectItem key={i} value={i}>
                                  {i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* <div className="h-full">
                <FileUploader
                  value={logo}
                  onValueChange={setLogo}
                  dropzoneOptions={{
                    maxFiles: 1,
                    maxSize: 1024 * 1024 * 1,
                    multiple: false,
                    accept: {
                      'image/png': ['.png'],
                      'image/jpg': ['.jpg'],
                    },
                  }}
                  className="relative rounded-lg bg-background p-2"
                >
                  <FileInput className="h-full outline-dashed outline-1 outline-white">
                    <div className="flex h-[400px] w-full flex-col pb-2 pt-3">
                      <FileUploadText
                        label={'Browse  Profile Image'}
                        description="Max file size is 1MB, Minimum dimension: 330x300 And Suitable files are .jpg & .png"
                      />
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {logo &&
                      logo.length > 0 &&
                      logo.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </div> */}
            </div>
            <div className="flex justify-center px-3 pb-10 lg:justify-end">
              <Button
                type="submit"
                variant={'default'}
                className="flex h-12 w-[250px] gap-2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
                <span>Submit</span>
              </Button>
            </div>
          </form>
        </Form>{' '}
      </DialogContent>
    </Dialog>
  );
};
