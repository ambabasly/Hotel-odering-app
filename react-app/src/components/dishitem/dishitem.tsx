import React from 'react'
import { Tag, Button } from 'antd'
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';


const Dishitem = ({
  name,
  description,
  price,
  category,
  soldOut,
  waitingTime,
  openModal,
  submitting,
  currentlyEditingId,
  currentAction,
  setCurrentAction,
  id,
  deleteAction,
}: {
  name: string,
  description: string,
  price: number,
  category: string,
  soldOut: boolean,
  waitingTime: number,
  openModal: () => void,
  submitting: boolean,
  currentlyEditingId: string,
  currentAction: string | null,
  setCurrentAction: (value: string | null) => void,
  id: string,
  deleteAction: () => void
}) => {
  return (
    <div className='dish-item'>
      <span className='listing'><b>Name: </b> {name}</span>
      <span className='listing'><b>Description: </b> {description}</span>
      <span className='listing'><b>Price: </b> €{price}</span>
      <span className='listing'><b>Category: </b> <Tag>{category}</Tag> </span>
      <span className='listing'><b>Available: </b>  {
        soldOut ? <Tag color="green">
          Still Available
        </Tag> : <Tag color="red">
          Not Available
        </Tag>
      } </span>
      <span className='listing'><b>Waiting Time: </b> {waitingTime}mins</span>
      <div className="actions">
        <Button loading={submitting && currentlyEditingId === id && currentAction === 'edit' ? true : false} disabled={submitting} onClick={() => {
          setCurrentAction('edit')
          openModal()
        }}>
          <EditOutlined />  Edit
        </Button>
        <Button loading={submitting && currentlyEditingId === id && currentAction === 'delete' ? true : false} disabled={submitting} onClick={() => {
          setCurrentAction('delete')
          deleteAction()
        }}>
          <DeleteOutlined /> Delete
        </Button>
      </div>
    </div>
  )
}

export default Dishitem