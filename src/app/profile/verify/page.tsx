
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from '@/hooks/use-toast';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { ChevronRight, ShieldCheck, Camera, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please enter a valid date in YYYY-MM-DD format." }),
  document: z.any().refine((files) => files?.length == 1, "Document is required."),
});

export default function VerifyPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dob: "",
    },
  });

  const getCameraPermission = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera not supported on this browser.');
      setHasCameraPermission(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to continue.',
      });
    }
  }, [toast]);
  
  useEffect(() => {
    getCameraPermission();
  }, [getCameraPermission]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log("Selfie data URI:", selfie);
    toast({
      title: "Verification Submitted",
      description: "Your verification details are being reviewed.",
    });
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL('image/jpeg');
      setSelfie(dataUri);
    }
  };

  const handleRetake = () => {
    setSelfie(null);
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
       <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/profile">Profile</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Identity Verification</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Identity Verification</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Step 1: Personal Information</CardTitle>
                    <CardDescription>Enter your legal name and date of birth exactly as they appear on your government-issued ID.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Step 2: Upload Document</CardTitle>
                    <CardDescription>Upload a clear image of your government-issued ID (e.g., Passport, Driver's License).</CardDescription>
                </CardHeader>
                <CardContent>
                     <FormField
                        control={form.control}
                        name="document"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>ID Document</FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => field.onChange(e.target.files)} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Step 3: Selfie Verification</CardTitle>
                    <CardDescription>Please take a clear photo of yourself. Make sure your face is well-lit and centered.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                        {selfie ? (
                            <img src={selfie} alt="User selfie" className="w-full h-full object-cover" />
                        ) : (
                             <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        )}
                        {hasCameraPermission === false && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                <AlertCircle className="h-10 w-10 text-destructive mb-2" />
                                <p className="font-semibold">Camera Access Denied</p>
                                <p className="text-sm text-muted-foreground">Please enable camera permissions in your browser settings to continue.</p>
                                <Button onClick={getCameraPermission} size="sm" className="mt-4">Retry</Button>
                            </div>
                        )}
                         {hasCameraPermission === null && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-muted-foreground">Requesting camera access...</p>
                            </div>
                        )}
                    </div>
                     {hasCameraPermission && (
                        <div className="flex justify-center gap-4">
                            {selfie ? (
                                <>
                                <Button onClick={handleRetake} variant="outline">Retake Selfie</Button>
                                <Button disabled>
                                    <Check className="mr-2" /> Selfie Captured
                                </Button>
                                </>
                            ) : (
                                <Button onClick={handleCapture}>
                                <Camera className="mr-2" /> Capture Selfie
                                </Button>
                            )}
                        </div>
                    )}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </CardContent>
            </Card>
          
            <Button type="submit" size="lg" className="w-full" disabled={!selfie}>Submit for Verification</Button>
        </form>
      </Form>
    </div>
  );
}
    