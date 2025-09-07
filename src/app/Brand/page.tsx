"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Textarea } from "@/components/textarea";
import { Badge } from "@/components/badge";
import Header from "@/components/commonheader";
import Toast from "@/components/Toast";
import { ToastState } from "@/types/library";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import {
  Sparkles,
  Palette,
  Type,
  Hash,
  Target,
  Save,
  Coffee,
  ShoppingBag,
  Scissors,
  Camera,
  Plus,
  X,
} from "lucide-react";

interface Brand {
  businessName: string;
  businessType: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  defaultHashtags: string[];
  brandVoice: string;
  targetAudience: string;
}

export default function BrandSetupPage() {
  const [brandData, setBrandData] = useState<Brand>({
    businessName: "",
    businessType: "cafe",
    description: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#ff0000",
    logoUrl: "",
    defaultHashtags: [],
    brandVoice: "friendly",
    targetAudience: "coffee-lovers",
  });

  useEffect(() => {
    const storedBrand = localStorage.getItem("brandSetting");
    const storedPreset = localStorage.getItem("brandPreset");

    if (storedBrand) {
      setBrandData(JSON.parse(storedBrand));
    } else if (storedPreset) {
      setBrandData(JSON.parse(storedPreset));
    }
  }, []);

  const [newHashtag, setNewHashtag] = useState("");

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const businessTypes = [
    { value: "cafe", label: "Café/Restaurant", icon: Coffee },
    { value: "retail", label: "Retail/Fashion", icon: ShoppingBag },
    { value: "salon", label: "Beauty/Salon", icon: Scissors },
    { value: "photography", label: "Photography", icon: Camera },
  ];

  const brandVoices = [
    { value: "friendly", label: "Friendly & Casual" },
    { value: "professional", label: "Professional & Formal" },
    { value: "playful", label: "Playful & Fun" },
    { value: "elegant", label: "Elegant & Sophisticated" },
  ];

  const targetAudiences = [
    { value: "coffee-lovers", label: "Coffee Enthusiasts" },
    { value: "young-professionals", label: "Young Professionals" },
    { value: "students", label: "Students" },
    { value: "families", label: "Families" },
    { value: "tourists", label: "Tourists" },
  ];

  const addHashtag = () => {
    if (
      newHashtag.trim() &&
      !brandData.defaultHashtags.includes(newHashtag.trim())
    ) {
      setBrandData({
        ...brandData,
        defaultHashtags: [...brandData.defaultHashtags, newHashtag.trim()],
      });
      setNewHashtag("");
    }
  };

  const removeHashtag = (index: number) => {
    setBrandData({
      ...brandData,
      defaultHashtags: brandData.defaultHashtags.filter((_, i) => i !== index),
    });
  };

  const saveBrand = () => {
    localStorage.setItem("brandSetting", JSON.stringify(brandData));
    showToast("Brand saved successfully", "success");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background ">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Business Information
              </CardTitle>
              <CardDescription>
                Basic details about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={brandData.businessName}
                    onChange={(e) =>
                      setBrandData({
                        ...brandData,
                        businessName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={brandData.businessType}
                    onValueChange={(value: string) =>
                      setBrandData({ ...brandData, businessType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(({ value, label, icon: Icon }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={brandData.description}
                  onChange={(e) =>
                    setBrandData({ ...brandData, description: e.target.value })
                  }
                  placeholder="Describe your business in a few sentences..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Brand Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Brand Colors
              </CardTitle>
              <CardDescription>
                Define your brand&apos;s color palette
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={brandData.primaryColor}
                      onChange={(e) =>
                        setBrandData({
                          ...brandData,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={brandData.primaryColor}
                      onChange={(e) =>
                        setBrandData({
                          ...brandData,
                          primaryColor: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={brandData.secondaryColor}
                      onChange={(e) =>
                        setBrandData({
                          ...brandData,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={brandData.secondaryColor}
                      onChange={(e) =>
                        setBrandData({
                          ...brandData,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="accentColor"
                      type="color"
                      value={brandData.accentColor}
                      onChange={(e) =>
                        setBrandData({
                          ...brandData,
                          accentColor: e.target.value,
                        })
                      }
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={brandData.accentColor}
                      onChange={(e) =>
                        setBrandData({
                          ...brandData,
                          accentColor: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div
                className="p-6 rounded-lg border"
                style={{ backgroundColor: `${brandData.primaryColor}10` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: brandData.primaryColor }}
                  >
                    <Sparkles
                      className="w-8 h-8"
                      style={{ color: brandData.secondaryColor }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: brandData.primaryColor }}
                    >
                      {brandData.businessName}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: brandData.accentColor }}
                    >
                      Brand Color Preview
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Brand Logo
              </CardTitle>
              <CardDescription>Upload your business logo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your logo here, or click to browse
                </p>
                <Button variant="outline">Choose File</Button>
              </div>
            </CardContent>
          </Card> */}

          {/* Default Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Default Hashtags
              </CardTitle>
              <CardDescription>
                Hashtags that will be automatically suggested for your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add hashtag"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addHashtag()}
                />
                <Button onClick={addHashtag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {brandData.defaultHashtags.map((hashtag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    #{hashtag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeHashtag(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Suggested Ethiopian Business Hashtags</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "EthiopianBusiness",
                    "AddisAbaba",
                    "MadeInEthiopia",
                    "LocalBrand",
                    "EthiopianEntrepreneur",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!brandData.defaultHashtags.includes(suggestion)) {
                          setBrandData({
                            ...brandData,
                            defaultHashtags: [
                              ...brandData.defaultHashtags,
                              suggestion,
                            ],
                          });
                        }
                      }}
                    >
                      #{suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Voice & Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Brand Voice & Audience
              </CardTitle>
              <CardDescription>
                Define how your brand communicates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Brand Voice</Label>
                  <Select
                    value={brandData.brandVoice}
                    onValueChange={(value: string) =>
                      setBrandData({ ...brandData, brandVoice: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brandVoices.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select
                    value={brandData.targetAudience}
                    onValueChange={(value: string) =>
                      setBrandData({ ...brandData, targetAudience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudiences.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg" onClick={saveBrand}>
              <Save className="w-4 h-4 mr-2" />
              Save Brand Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toast toast={toast} />
    </div>
  );
}
