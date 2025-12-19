import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Car, MapPin, Navigation, Clock, Star, 
  Brain, Zap, ChevronRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RideOption {
  id: string;
  name: string;
  description: string;
  price: number;
  eta: number;
  icon: string;
  surge?: number;
  aiOptimized?: boolean;
}

interface Driver {
  name: string;
  rating: number;
  trips: number;
  car: string;
  plate: string;
  avatar: string;
}

const rideOptions: RideOption[] = [
  { id: "economy", name: "RideAI Economy", description: "Affordable rides", price: 12.50, eta: 5, icon: "🚗", aiOptimized: true },
  { id: "comfort", name: "RideAI Comfort", description: "Extra legroom & AC", price: 18.75, eta: 3, icon: "🚙" },
  { id: "premium", name: "RideAI Premium", description: "Luxury vehicles", price: 32.00, eta: 7, icon: "🏎️" },
  { id: "xl", name: "RideAI XL", description: "6 passengers", price: 24.50, eta: 8, icon: "🚐" },
  { id: "green", name: "RideAI Green", description: "Electric vehicles", price: 14.00, eta: 6, icon: "⚡", aiOptimized: true },
];

const mockDriver: Driver = {
  name: "Alex Johnson",
  rating: 4.92,
  trips: 2847,
  car: "Tesla Model 3",
  plate: "ABC 1234",
  avatar: "👤"
};

const Index = () => {
  const [pickup, setPickup] = useState("123 Main Street, San Francisco");
  const [destination, setDestination] = useState("");
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [rideState, setRideState] = useState<"search" | "options" | "matching" | "confirmed">("search");
  const [matchProgress, setMatchProgress] = useState(0);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSurgeMultiplier(1 + Math.random() * 0.3);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (rideState === "matching") {
      const timer = setInterval(() => {
        setMatchProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setRideState("confirmed");
            toast({ title: "Driver Found!", description: `${mockDriver.name} is on the way` });
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [rideState]);

  const handleSearch = () => {
    if (!destination) {
      toast({ title: "Enter destination", description: "Please enter where you want to go", variant: "destructive" });
      return;
    }
    setRideState("options");
  };

  const handleSelectRide = (id: string) => {
    setSelectedRide(id);
  };

  const handleConfirmRide = () => {
    if (!selectedRide) return;
    setRideState("matching");
    setMatchProgress(0);
  };

  const selectedOption = rideOptions.find(r => r.id === selectedRide);

  return (
    <>
      <Helmet>
        <title>RideAI - Smart Ride Sharing | Nizar Hussain</title>
        <meta name="description" content="AI-powered ride sharing with intelligent matching and dynamic pricing" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-violet-950 to-background">
        <header className="sticky top-0 z-50 bg-violet-950/95 backdrop-blur border-b border-violet-800/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-6 h-6 text-violet-400" />
                <span className="text-xl font-bold text-foreground">RideAI</span>
              </div>
              <Badge className="bg-violet-600/20 text-violet-400 border-violet-600/30">
                <Brain className="w-3 h-3 mr-1" />
                AI-Powered Matching
              </Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="relative rounded-xl overflow-hidden border border-violet-800/30 bg-violet-900/20 h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Navigation className="w-16 h-16 text-violet-400 mx-auto mb-4 animate-pulse" />
                  <p className="text-muted-foreground">Interactive Map View</p>
                  <p className="text-sm text-violet-400 mt-2">ML-optimized route displayed here</p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 bg-violet-950/80 p-3 rounded-lg backdrop-blur">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded-full bg-violet-400" />
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600" />
                  <div className="w-3 h-3 rounded-full bg-violet-600" />
                </div>
                <span className="text-sm text-muted-foreground">~15 min • 4.2 mi</span>
              </div>
            </div>

            <div className="space-y-6">
              {rideState === "search" && (
                <Card className="bg-card border-violet-800/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-violet-400" />
                      Where to?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-400" />
                        <Input
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          className="pl-8 bg-violet-900/20 border-violet-800/50"
                          placeholder="Pickup location"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-600" />
                        <Input
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="pl-8 bg-violet-900/20 border-violet-800/50"
                          placeholder="Where to?"
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-violet-600 hover:bg-violet-700" 
                      size="lg"
                      onClick={handleSearch}
                    >
                      Search Rides
                    </Button>
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-violet-800/30">
                      <div className="text-center p-3 rounded-lg bg-violet-900/20">
                        <Brain className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Smart Match</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-violet-900/20">
                        <Zap className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Dynamic Price</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-violet-900/20">
                        <Navigation className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">ETA Prediction</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {rideState === "options" && (
                <Card className="bg-card border-violet-800/30">
                  <CardHeader className="border-b border-violet-800/30">
                    <CardTitle>Choose a Ride</CardTitle>
                    {surgeMultiplier > 1.1 && (
                      <Badge variant="destructive" className="w-fit">
                        <Zap className="w-3 h-3 mr-1" />
                        {surgeMultiplier.toFixed(1)}x Surge Pricing
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    {rideOptions.map(option => (
                      <div
                        key={option.id}
                        onClick={() => handleSelectRide(option.id)}
                        className={`p-4 border-b border-violet-800/30 cursor-pointer transition-colors ${
                          selectedRide === option.id 
                            ? 'bg-violet-600/20 border-l-4 border-l-violet-400' 
                            : 'hover:bg-violet-900/20'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{option.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{option.name}</span>
                              {option.aiOptimized && (
                                <Badge className="bg-violet-600/20 text-violet-400 text-[10px]">
                                  AI Optimized
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-violet-400">
                              ${(option.price * surgeMultiplier).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {option.eta} min
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {rideState === "options" && selectedRide && (
                <Button 
                  className="w-full bg-violet-600 hover:bg-violet-700" 
                  size="lg"
                  onClick={handleConfirmRide}
                >
                  Confirm {selectedOption?.name}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {rideState === "matching" && (
                <Card className="bg-card border-violet-800/30">
                  <CardContent className="py-12 text-center">
                    <Brain className="w-16 h-16 text-violet-400 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-xl font-semibold mb-2">Finding Your Driver</h3>
                    <p className="text-muted-foreground mb-6">AI matching based on ETA, rating & route</p>
                    <div className="w-full h-2 bg-violet-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-violet-400 transition-all duration-300"
                        style={{ width: `${matchProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-violet-400 mt-2">{matchProgress}% matched</p>
                  </CardContent>
                </Card>
              )}

              {rideState === "confirmed" && (
                <Card className="bg-card border-violet-800/30">
                  <CardHeader className="border-b border-violet-800/30">
                    <CardTitle className="text-violet-400">Driver On The Way!</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-violet-900/50 flex items-center justify-center text-3xl">
                        {mockDriver.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{mockDriver.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span>{mockDriver.rating}</span>
                          <span>•</span>
                          <span>{mockDriver.trips} trips</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 p-4 rounded-lg bg-violet-900/20">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Vehicle</span>
                        <span>{mockDriver.car}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">License Plate</span>
                        <span className="font-mono">{mockDriver.plate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Arriving in</span>
                        <span className="text-violet-400">3 minutes</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button variant="outline" className="flex-1 border-violet-800/50">
                        Contact Driver
                      </Button>
                      <Button variant="destructive" className="flex-1">
                        Cancel Ride
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <footer className="border-t border-violet-800/30 mt-16 py-8 bg-violet-950/50">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground text-sm mb-4">
              <Badge variant="outline" className="mr-2">Demo Project</Badge>
              Built with AI/ML for intelligent ride matching
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["React Native", "Go", "Python", "PyTorch", "MongoDB", "Kafka", "GCP"].map(tech => (
                <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;

