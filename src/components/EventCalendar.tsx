import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar as CalendarIcon, Plus, PartyPopper, Briefcase, Music, Trophy } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { toast } from 'sonner@2.0.3';
import type { Event } from '../App';

interface EventCalendarProps {
  events: Event[];
  onAddEvent: (event: Event) => void;
}

export function EventCalendar({ events, onAddEvent }: EventCalendarProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'casual' as Event['type'],
    description: '',
  });

  const eventTypes = [
    { value: 'casual', label: 'Casual', icon: '👕', color: 'bg-blue-100 text-blue-700' },
    { value: 'formal', label: 'Formal', icon: '👔', color: 'bg-gray-100 text-gray-700' },
    { value: 'party', label: 'Party', icon: '🎉', color: 'bg-pink-100 text-pink-700' },
    { value: 'festival', label: 'Festival', icon: '🎊', color: 'bg-purple-100 text-purple-700' },
    { value: 'work', label: 'Work', icon: '💼', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'sport', label: 'Sport', icon: '⚽', color: 'bg-green-100 text-green-700' },
  ];

  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDate) {
      toast.error('Please provide event title and date');
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      type: newEvent.type,
      description: newEvent.description,
    };

    onAddEvent(event);
    toast.success('Event added to calendar!');
    setIsAddDialogOpen(false);
    setNewEvent({
      title: '',
      type: 'casual',
      description: '',
    });
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'party':
        return <PartyPopper className="w-4 h-4" />;
      case 'work':
      case 'formal':
        return <Briefcase className="w-4 h-4" />;
      case 'festival':
        return <Music className="w-4 h-4" />;
      case 'sport':
        return <Trophy className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const eventDates = events.map(event => event.date.toDateString());

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Event Calendar</CardTitle>
              <CardDescription>Track your upcoming events and occasions</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>Schedule an upcoming event or occasion</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Event Title</Label>
                    <Input
                      placeholder="e.g., Birthday Party, Office Meeting"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <Select value={newEvent.type} onValueChange={(value: Event['type']) => setNewEvent({ ...newEvent, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Input
                      placeholder="Add details about the event"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleAddEvent} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                    Add Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasEvent: (date) => eventDates.includes(date.toDateString())
            }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: 'rgb(168, 85, 247, 0.2)',
                fontWeight: 'bold'
              }
            }}
          />

          {selectedDate && getEventsForDate(selectedDate).length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm">Events on {selectedDate.toLocaleDateString()}</h4>
              {getEventsForDate(selectedDate).map(event => {
                const eventType = eventTypes.find(t => t.value === event.type);
                return (
                  <Card key={event.id} className="p-3">
                    <div className="flex items-center gap-3">
                      {getEventIcon(event.type)}
                      <div className="flex-1">
                        <p className="text-sm">{event.title}</p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        )}
                      </div>
                      <Badge className={eventType?.color}>
                        {eventType?.label}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your scheduled occasions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 mx-auto text-purple-300 mb-3" />
              <p className="text-purple-600">No upcoming events</p>
              <p className="text-sm text-muted-foreground mt-1">Add events to get outfit suggestions</p>
            </div>
          ) : (
            upcomingEvents.map(event => {
              const eventType = eventTypes.find(t => t.value === event.type);
              const daysUntil = Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg p-3 text-center min-w-[60px]">
                      <p className="text-xs opacity-90">
                        {event.date.toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                      <p className="text-xl">
                        {event.date.getDate()}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getEventIcon(event.type)}
                        <h4>{event.title}</h4>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge className={eventType?.color}>
                          {eventType?.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}

          {/* Festival Reminders */}
          <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
            <CardContent className="p-4">
              <h4 className="text-sm mb-2">Upcoming Festivals 🎊</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Diwali</span>
                  <span className="text-muted-foreground">Nov 20, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Christmas</span>
                  <span className="text-muted-foreground">Dec 25, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>New Year</span>
                  <span className="text-muted-foreground">Jan 1, 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
