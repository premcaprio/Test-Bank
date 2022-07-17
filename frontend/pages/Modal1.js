import React from 'react';
import styles from '../styles/Home.module.css'

const buttonStyle = {
    width: "100%",
};



const Modal1 = props => {

  if (!props.show) {
    return null
  }

  return(
    <div className={styles.modaly} onClick={props.onClose}>
      <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className={styles.modal_title}>{props.account}: {props.balance} ADO</h2>
        </div>
        <div className="modal-body">

          <form onSubmit={e => props.depositOrWithdrawOrTransfer(e, props.account)}>

            <div className="row">
              <div className="col-md-3">
                <label>Amount</label>
              </div>
              <div className="col-md-8">
                <input style={{width: "300px"}} placeholder = "deposit amount" onChange={e => props.setAmount(props.toWei(e.target.value))}/>
              </div>
            </div>

            <div className="row">
              <div className="col-md-7">
              </div>
              <div className="col-md-4" >
                <button style={{width: "100%"}} onClick={ e => props.setIsDeposit(true) } className="btn btn-primary">Deposit</button>
              </div>
              
            </div>
          </form>

        </div>

        <div className="modal-footer">
          <button style={{marginRight: "42px"}} onClick={ props.onClose } className="btn btn-primary">Close</button>
        </div>
      </div>
    </div>
  )
}

export default Modal1