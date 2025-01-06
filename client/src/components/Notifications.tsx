import { Modal, Badge, message, Button } from 'antd'
import moment from 'moment'
import { Notification } from '../types/notification'
import { useNavigate } from 'react-router-dom'
import { DeleteNotification } from '../apicalls/notifications'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
interface NotificationsProps {
  setShowNotifications: (show: boolean) => void
  showNotifications: boolean
  notifications: Array<Notification> | null
  reloadNotifications: () => void
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications = [],
  reloadNotifications,
  showNotifications,
  setShowNotifications
}) => {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  const deleteNotification = async (id: string) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(id))
      const response = await DeleteNotification(id)
      if (response.success) {
        message.success('Notification deleted successfully')
        reloadNotifications()
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }
  return (
    <Modal
      title='Notifications'
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      footer={null}
      centered
    >
      <div className='flex flex-col gap-3 max-h-[60vh] overflow-y-auto'>
        {notifications?.length === 0 ? (
          <div className='flex justify-center'>
            <h3>No notifications yet</h3>
          </div>
        ) : (
          notifications?.map((notification) => (
            <div key={notification._id} className='flex flex-col gap-2 p-2 border border-solid rounded border-gray-300'>
              <div className='flex justify-between items-center'>
                <div className='flex gap-2'>
                  {!notification.read && <Badge status='processing' color='blue' />}
                  <h3 className='text-gray-700'>{notification.title}</h3>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>{moment(notification.createdAt).fromNow()}</span>
                  <Button
                    type='text'
                    danger
                    icon={<i className='ri-delete-bin-7-line'></i>}
                    loading={deletingIds.has(notification._id)}
                    onClick={() => deleteNotification(notification._id)}
                  />
                </div>
              </div>
              <span className='text-gray-600'>{notification.message}</span>
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}

export default Notifications
