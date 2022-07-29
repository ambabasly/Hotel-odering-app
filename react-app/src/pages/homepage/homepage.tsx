import React, { useState, useEffect, useCallback } from 'react'
import { Col, Row, message, Button, Form, Modal, Input, Select } from 'antd'
import axios from 'axios'
import Dishitem from '../../components/dishitem/dishitem'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

const baseApi = 'http://localhost:9000'

const Homepage = () => {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [currentlyEditing, setCurrentlyEditing] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [currentAction, setCurrentAction] = useState<null | string>(null)

  const openModal = (value: any) => {
    setCurrentlyEditing(value)
  }

  const closeModal = () => {
    setVisible(false)
    setCurrentlyEditing(null)
    setCurrentAction(null)
  }

  const getDishes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${baseApi}/dishes`)
      const { data } = res.data
      setDishes(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      message.error('Something went wrong')
    }
  }, [])

  const onFinish = async (values: any) => {
    setSubmitting(true)
    try {
      const obj = { ...values }

      if (currentlyEditing !== null) {
        obj._id = currentlyEditing._id
      }

      await axios.put(`${baseApi}/dishes`, {
        ...obj
      })

      closeModal()
      getDishes()

      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      message.error('Something went wrong')
    }
  }

  const deleteDish = async (id: string) => {
    setSubmitting(true)
    try {
      await axios.delete(`${baseApi}/dishes/${id}`)
      setSubmitting(false)
      getDishes()
      closeModal()
    } catch (error) {
      setSubmitting(false)
      message.error('Something went wrong')
    }
  }

  useEffect(() => {
    getDishes()
  }, [getDishes])

  return (
    <div className='homepage'>
      <div className='logo-holder'>
        <h1>Hotel</h1>
        <h1>Ordering App</h1>
        <div className='action-holder'>
          <Button
            type='primary'
            onClick={() => {
              setVisible(true)
              setCurrentlyEditing(null)
            }}
          >
            <PlusOutlined /> Add Dish
          </Button>
        </div>
      </div>

      <div className='data-holder'>
        {loading ? (
          <div className='loader-holder'>
            <LoadingOutlined />
          </div>
        ) : (
          <>
            {dishes.length === 0 ? (
              <p className='center-text'>
                There are no dishes, kindly add dishes
              </p>
            ) : (
              <Row gutter={16}>
                {dishes.map((item: any, index: number) => (
                  <Col
                    lg={8}
                    md={8}
                    xs={24}
                    key={`dish-item-${item._id}-${index}`}
                  >
                    <Dishitem
                      id={item._id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      category={item.category}
                      soldOut={item.soldOut}
                      waitingTime={item.waitingTime}
                      openModal={() => {
                        openModal(item)
                      }}
                      submitting={submitting}
                      currentlyEditingId={currentlyEditing?._id}
                      currentAction={currentAction}
                      setCurrentAction={setCurrentAction}
                      deleteAction={() => {
                        setCurrentlyEditing(item)
                        deleteDish(item._id)
                      }}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </div>

      {visible && (
        <Modal
          title={`${
            currentlyEditing === null
              ? 'Add Dish'
              : `Edit Dish ${currentlyEditing?.name}`
          }`}
          footer={null}
          visible={visible}
          onCancel={submitting ? undefined : closeModal}
          onOk={submitting ? undefined : closeModal}
          destroyOnClose
        >
          <Form
            layout='vertical'
            onFinish={onFinish}
            initialValues={
              currentlyEditing === null
                ? undefined
                : {
                    ...currentlyEditing
                  }
            }
          >
            <Form.Item
              label='Name'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Input is required'
                }
              ]}
            >
              <Input placeholder='Name' />
            </Form.Item>
            <Form.Item
              label='Description'
              name='description'
              rules={[
                {
                  required: true,
                  message: 'Input is required'
                }
              ]}
            >
              <Input.TextArea placeholder='Description' />
            </Form.Item>
            <Form.Item
              label='Price'
              name='price'
              rules={[
                {
                  required: true,
                  message: 'Input is required'
                }
              ]}
            >
              <Input
                onKeyPress={event => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault()
                  }
                }}
                placeholder='Price'
              />
            </Form.Item>
            <Form.Item
              label='Category'
              name='category'
              rules={[
                {
                  required: true,
                  message: 'Input is required'
                }
              ]}
            >
              <Select>
                <Select.Option value='Starter'>Starter</Select.Option>
                <Select.Option value=' Main Course'>Main Course</Select.Option>
                <Select.Option value='Desert'>Desert</Select.Option>
                <Select.Option value='Beverage'>Beverage</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label='Availablity'
              name='soldOut'
              rules={[
                {
                  required: true,
                  message: 'Input is required'
                }
              ]}
            >
              <Select>
                <Select.Option value={true}>Avialable</Select.Option>
                <Select.Option value={false}>Not Available</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label='Waiting Time(mins)'
              name='waitingTime'
              rules={[
                {
                  required: true,
                  message: 'Input is required'
                }
              ]}
            >
              <Input
                onKeyPress={event => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault()
                  }
                }}
                placeholder='Waiting Time(mins)'
              />
            </Form.Item>
            <Form.Item>
              <Button
                block
                type='primary'
                htmlType='submit'
                loading={submitting}
                disabled={submitting}
              >
                {currentlyEditing === null ? 'Add Dish' : 'Edit Dish'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default Homepage
