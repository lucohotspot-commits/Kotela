
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { ChevronRight, ShieldCheck, Camera, Check, AlertCircle, ArrowLeft, ArrowRight, Upload, FileText, CameraIcon, FileUp } from 'lucide-react';
import { PhoneInput, type Country } from '@/components/ui/phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getYears, getMonths, getDaysInMonth } from '@/lib/dates';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const formSchema = z.object({
  country: z.string({ required_error: "Please select a country." }).min(2, "Please select a country."),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters." }),
  givenName: z.string().optional(),
  middleName: z.string().optional(),
  dob_year: z.string({ required_error: "Please select a year." }),
  dob_month: z.string({ required_error: "Please select a month." }),
  dob_day: z.string({ required_error: "Please select a day." }),
  documentType: z.string({ required_error: "Please select a document type." }),
  document: z.any().refine((file) => file, "Document image is required."),
});

type VerificationFormValues = z.infer<typeof formSchema>;

const verificationSteps = [
    { step: 1, title: "Personal Info" },
    { step: 2, title: "Upload Document" },
    { step: 3, title: "Selfie" },
];

export default function VerifyPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [uploadMode, setUploadMode] = useState<'select' | 'upload' | 'camera'>('select');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: 'US',
      phoneNumber: '',
      surname: "",
      givenName: "",
      middleName: "",
      dob_year: "",
      dob_month: "",
      dob_day: "",
      documentType: "",
    },
    mode: 'onChange',
  });

  const getCameraPermission = useCallback(async (isDocumentCamera = false) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera not supported on this browser.');
      setHasCameraPermission(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);

      const videoElement = isDocumentCamera ? document.getElementById('doc-video') as HTMLVideoElement : videoRef.current;
      if (videoElement) {
        videoElement.srcObject = stream;
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
    if (step === 3) {
      getCameraPermission();
    }
     if (step === 2 && uploadMode === 'camera') {
      getCameraPermission(true);
    }
  }, [step, uploadMode, getCameraPermission]);

  function onSubmit(values: VerificationFormValues) {
    const dob = `${values.dob_year}-${values.dob_month}-${values.dob_day}`;
    console.log({...values, dob});
    console.log("Selfie data URI:", selfie);
    toast({
      title: "Verification Submitted",
      description: "Your verification details are being reviewed.",
    });
    // Maybe redirect or show a success message
  }

  const handleCaptureSelfie = () => {
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

  const handleCaptureDocument = () => {
    const video = document.getElementById('doc-video') as HTMLVideoElement;
    if (video && canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUri = canvas.toDataURL('image/jpeg');
            
            form.setValue('document', dataUri, { shouldValidate: true });
            setDocumentPreview(dataUri);
            
            // Stop camera stream
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
        setUploadMode('select');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('document', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleRetakeSelfie = () => {
    setSelfie(null);
  }

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  
  const watchedYear = form.watch('dob_year');
  const watchedMonth = form.watch('dob_month');

  const years = getYears();
  const months = getMonths();
  const days = getDaysInMonth(watchedYear ? parseInt(watchedYear) : null, watchedMonth ? parseInt(watchedMonth) - 1 : null);

  const isStep1Valid = form.watch('country') && form.watch('phoneNumber') && form.watch('surname') && form.watch('dob_day') && form.watch('dob_month') && form.watch('dob_year') && !form.getFieldState('country').invalid && !form.getFieldState('phoneNumber').invalid && !form.getFieldState('surname').invalid && !form.getFieldState('dob_day').invalid && !form.getFieldState('dob_month').invalid && !form.getFieldState('dob_year').invalid;
  const isStep2Valid = form.watch('documentType') && documentPreview;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
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
      
      <div className="space-y-4">
          <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Identity Verification</h1>
          </div>

          <div className="flex items-center justify-between">
            {verificationSteps.map((item, index) => {
              const isCompleted = step > item.step;
              const isCurrent = step === item.step;
              
              return (
                <div key={item.step} className="flex items-center w-full">
                  <div className="flex flex-col items-center">
                      <div
                          className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                              isCompleted ? "bg-primary text-primary-foreground" :
                              isCurrent ? "border-2 border-primary text-primary" :
                              "bg-muted text-muted-foreground"
                          )}
                      >
                          {isCompleted ? <Check className="w-5 h-5" /> : item.step}
                      </div>
                      <p className={cn(
                          "text-xs mt-2",
                           isCurrent ? "font-bold text-primary" : "text-muted-foreground"
                      )}>{item.title}</p>
                  </div>
                  
                  {index < verificationSteps.length - 1 && (
                      <div className={cn(
                          "flex-1 h-0.5 mx-4",
                          isCompleted ? "bg-primary" : "bg-muted"
                      )}></div>
                  )}
                </div>
              );
            })}
          </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Step 1: Personal Information</CardTitle>
                        <CardDescription>Enter your legal name and date of birth exactly as they appear on your government-issued ID.</CardDescription>
                    </CardHeader>
                    <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className="sm:col-span-2">
                           <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Country & Phone Number (Required)</FormLabel>
                                    <FormControl>
                                        <PhoneInput 
                                            {...field}
                                            country={form.watch('country') as Country}
                                            onCountryChange={(country) => form.setValue('country', country)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField control={form.control} name="surname" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Surname (Required)</FormLabel>
                                <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="givenName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Given Name (Optional)</FormLabel>
                                <FormControl><Input placeholder="Michael" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="middleName" render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                                <FormLabel>Middle Name (Optional)</FormLabel>
                                <FormControl><Input placeholder="James" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="sm:col-span-2 grid grid-cols-3 gap-3">
                            <FormField
                                control={form.control}
                                name="dob_month"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Month</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Month" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {months.map(month => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="dob_day"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Day</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!watchedMonth}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Day" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {days.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dob_year"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className='justify-end'>
                         <Button onClick={nextStep} disabled={!isStep1Valid}>
                            Next <ArrowRight className="ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Step 2: Document Verification</CardTitle>
                        <CardDescription>Select the type of document you'd like to upload.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="documentType"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Document Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a document type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                                    <SelectItem value="national_id">National ID Card</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        {form.watch('documentType') && uploadMode === 'select' && (
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setUploadMode('upload')}>
                                    <FileUp className="h-8 w-8" />
                                    <span>Upload File</span>
                                </Button>
                                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setUploadMode('camera')}>
                                    <CameraIcon className="h-8 w-8" />
                                    <span>Use Camera</span>
                                </Button>
                            </div>
                        )}
                        
                        {uploadMode === 'upload' && (
                            <FormField
                                control={form.control}
                                name="document"
                                render={() => ( // We don't use field here because we have a custom handler
                                <FormItem>
                                    <FormLabel>Upload your document</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        )}

                        {uploadMode === 'camera' && (
                             <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                                <video id="doc-video" className="w-full h-full object-cover" autoPlay muted playsInline />
                                {hasCameraPermission === false && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
                                        <p className="font-semibold">Camera Access Denied</p>
                                    </div>
                                )}
                                <Button onClick={handleCaptureDocument} className="absolute bottom-4 z-10" size="lg" disabled={!hasCameraPermission}>
                                    <Camera className="mr-2" /> Capture Document
                                </Button>
                            </div>
                        )}

                        {documentPreview && (
                            <div className="space-y-2">
                                <Label>Document Preview</Label>
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                    <Image src={documentPreview} alt="Document preview" layout="fill" objectFit="contain" />
                                </div>
                                <Button variant="link" onClick={() => { setDocumentPreview(null); form.setValue('document', null); setUploadMode('select'); }}>
                                    Clear and re-upload
                                </Button>
                            </div>
                        )}

                    </CardContent>
                     <CardFooter className='justify-between'>
                         <Button onClick={prevStep} variant="outline">
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                         <Button onClick={nextStep} disabled={!isStep2Valid}>
                            Next <ArrowRight className="ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            )}


            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Step 3: Selfie Verification</CardTitle>
                        <CardDescription>Please take a clear photo of yourself. Make sure your face is well-lit and centered.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                            {selfie ? (
                                <Image src={selfie} alt="User selfie" className="w-full h-full object-cover" width={640} height={480} />
                            ) : (
                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            )}
                            {hasCameraPermission === false && (
                                <Alert variant="destructive" className="absolute bottom-4 w-auto">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertTitle>Camera Access Denied</AlertTitle>
                                  <AlertDescription>
                                    Please enable camera permissions to continue.
                                  </AlertDescription>
                                </Alert>
                            )}
                            {hasCameraPermission === null && !selfie && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-muted-foreground">Requesting camera access...</p>
                                </div>
                            )}
                        </div>
                        {hasCameraPermission && (
                            <div className="flex justify-center gap-4">
                                {selfie ? (
                                    <>
                                    <Button onClick={handleRetakeSelfie} variant="outline">Retake Selfie</Button>
                                    <Button disabled>
                                        <Check className="mr-2" /> Selfie Captured
                                    </Button>
                                    </>
                                ) : (
                                    <Button onClick={handleCaptureSelfie}>
                                    <Camera className="mr-2" /> Capture Selfie
                                    </Button>
                                )}
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </CardContent>
                    <CardFooter className='justify-between'>
                         <Button onClick={prevStep} variant="outline">
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                         <Button type="submit" size="lg" disabled={!selfie || !isStep1Valid || !isStep2Valid}>Submit for Verification</Button>
                    </CardFooter>
                </Card>
            )}
        </form>
      </Form>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
