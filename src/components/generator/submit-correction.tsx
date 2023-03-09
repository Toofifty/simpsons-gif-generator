import {
  Button,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { api, QuoteContextResponseData } from '../../api';
import { episodeIdentifier } from '../../utils';

interface SubmitCorrectionProps {
  context: QuoteContextResponseData;
  correction?: number;
  onClose: () => void;
}

export const SubmitCorrection = ({
  context,
  correction: initialCorrection,
  onClose,
}: SubmitCorrectionProps) => {
  const [correction, setCorrection] = useInputState<number | ''>(
    initialCorrection!
  );
  const [passcode, setPasscode] = useInputState('');

  useEffect(() => {
    setCorrection(initialCorrection);
  }, [initialCorrection]);

  const submit = async () => {
    if (!correction) return;

    const response = await api.correction({
      id: context.meta.episode_number,
      correction: correction! * 1000,
      passcode,
    });
    if ('error' in response) {
      notifications.show({
        title: 'Error',
        message: response.error,
        color: 'red',
        autoClose: false,
      });
      return;
    }

    notifications.show({
      title: 'Success',
      message: response.data.message,
    });
    onClose();
  };

  return (
    <Modal
      opened={correction !== undefined}
      onClose={onClose}
      title="Submit correction"
      centered
    >
      <Stack>
        <NumberInput
          label="Correction"
          name="correction"
          required
          value={correction}
          onChange={setCorrection}
        />
        <TextInput
          label="Passcode"
          name="passcode"
          required
          value={passcode}
          onChange={setPasscode}
        />
        <Text color="dimmed">
          Submitting a correction of{' '}
          <Text component="span" fw="bold">
            {(correction || 0) > 0 && '+'}
            {((correction || 0) * 1000).toFixed(0)}ms
          </Text>{' '}
          for episode:{' '}
          <Text component="span" fw="bold">
            {episodeIdentifier(context.meta)} (#
            {context.meta.episode_number})
          </Text>
        </Text>
        <Button
          type="submit"
          variant="filled"
          disabled={!passcode}
          onClick={submit}
        >
          Submit
        </Button>
      </Stack>
    </Modal>
  );
};
