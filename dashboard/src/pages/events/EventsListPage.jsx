import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import FilterTabs from '../../components/FilterTabs.jsx'
import EventsTable from './EventsTable.jsx'

const FILTERS = [
  ['all', 'الكل'],
  ['meeting', 'لقاءات'],
  ['program', 'برامج'],
  ['competition', 'مسابقات'],
]

const NO_EVENTS = []

// "الفعاليات المضافة" tab
export default function EventsListPage() {
  const { events, eventsError, filter, setFilter, startEdit, deleteEvent } = useOutletContext()
  const { can } = useAuth()

  // `events` is null while loading; the table shows "جاري التحميل..." for that
  const filtered = useMemo(() => {
    if (events === null || filter === 'all') return events
    return events.filter((ev) => ev.category === filter)
  }, [events, filter])

  return (
    <>
      <div className="list-header">
        <h3>الفعاليات المضافة</h3>
        <FilterTabs
          filters={FILTERS}
          items={events ?? NO_EVENTS}
          field="category"
          value={filter}
          onChange={setFilter}
        />
      </div>

      <EventsTable
        events={filtered}
        error={eventsError}
        canEdit={can('events_edit')}
        canDelete={can('events_delete')}
        onEdit={startEdit}
        onDelete={deleteEvent}
      />
    </>
  )
}
