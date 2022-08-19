import styles from "../styles/ConnectWallet.module.css";
import Box from '@mui/material/Box';
import logo from '../logo/de-freelancer-logo.png';

const ConnectWalletButton = ({
  onPressConnect,
  address,
  loading
}) => {
  return (
    <div>
      {
        loading ? (
          <button disabled>
            <div>Loading...</div>
          </button>
        ) : address !== "" ? (
          <>Your wallet: {address}</>
        )
          : (
            <>
              <Box
                component="img"
                sx={{
                  height: 200,
                  width: 200,
                  maxHeight: { xs: 200, md: 500 },
                  maxWidth: { xs: 200, md: 500 },
                }}
                alt="logo"
                src={logo}
              />
              <button onClick={onPressConnect} className={styles["connect-wallet"]}>
                Connect Wallet
              </button>

            </>
          )}
    </div>
  );
};

export default ConnectWalletButton;