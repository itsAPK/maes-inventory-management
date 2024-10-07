'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { AlertTriangle, Loader } from 'lucide-react';
import { ContentLayout } from '@/components/content-layout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AddUser() {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
  });
  const [logo, setLogo] = useState<File[] | null>(null);

  const queryClient = useQueryClient();
  const router = useRouter();

  const create = useMutation({
    mutationKey: ['create-user'],
    mutationFn: async (data: UserSchema) => {
      return await api
        .post(`/user`, data)
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
      toast.success('User Created', {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      router.push('/user');
      router.refresh();
    },
  });

  const onSubmit = form.handleSubmit(async (data: UserSchema) => {
    await create.mutateAsync(data);
  });

  return (
    <ContentLayout title={'Add User'} tags={['users', 'new']}>
      <div className="shadow-form container relative mb-7 min-h-[120px] bg-white pt-10 shadow dark:bg-background">
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
      </div>
    </ContentLayout>
  );
}
